package org.projectodd.nodyn.buffer.prototype;

import java.io.UnsupportedEncodingException;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodyn.buffer.BufferType;

public class ByteLength extends AbstractNativeFunction {

	public ByteLength(GlobalObject globalObject) {
		super(globalObject, "string", "encoding");
	}

	@Override
	public Object call(ExecutionContext context, Object self, Object... args) {
		if (!(args[0] instanceof String)) {
			throw new ThrowException(context,
					context.createTypeError("Argument must be a string."));
		}
		String string = Types.toString(context, args[0]);
		byte[] stringBytes = null;
		if (args.length > 1) {
			String encoding = Types.toString(context, args[1]);
			try {
				stringBytes = string.getBytes(BufferType.getCharset(BufferType
						.getEncoding(encoding)));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		} else {
			stringBytes = string.getBytes();
		}
		
		return stringBytes.length;
	}

}
